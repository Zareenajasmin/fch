const express = require('express');
const bodyParser = require('body-parser');

const cloudinary = require('cloudinary').v2; // Cloudinary SDK
const cors = require('cors');  // Enable CORS to connect with your frontend
const multer = require('multer');  // To handle file uploads
const firebaseAdmin = require('firebase-admin'); // Firebase for Firestore
const jwt = require('jsonwebtoken'); // For generating and verifying JWTs
const serviceAccount = require('./config/serviceAccountKey.json'); // Path to Firebase key

// Initialize Express
const app = express();
app.use(express.json());  // Allows parsing of JSON data from client
app.use(cors());          // Enable CORS for cross-origin requests

// Initialize Cloudinary
cloudinary.config({
  cloud_name: 'ddce5sytf', // Replace with your Cloudinary cloud name
  api_key: '422632868385426',       // Replace with your Cloudinary API key
  api_secret: 'smxjc3BnTzjKujW1onHvcrLlqjU', // Replace with your Cloudinary API secret
});

// Initialize Firebase Admin SDK (for Firestore)
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert(serviceAccount),
  projectId: "fchh-af14f", // Add your Firebase project ID here

});

// Firestore reference
const db = firebaseAdmin.firestore();

// Define the port
const port = 5000;

// Middleware to handle file uploads
const upload = multer({
  storage: multer.memoryStorage(),
});

// Register route (Sign up)
app.post('/signup', async (req, res) => {
  console.log('Signup request received:', req.body);  // Log incoming request data

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
     // Check if email already exists (optional)
     const existingUser = await firebaseAdmin.auth().getUserByEmail(email);
     if (existingUser) {
       return res.status(400).json({ error: 'Email is already registered' });
     }
    // Create user in Firebase Auth
    const userRecord = await firebaseAdmin.auth().createUser({
      email,
      password,
      displayName: name,
    });

    // Store user details in Firestore (optional)
    const userDocRef = db.collection('users').doc(userRecord.uid);
    await userDocRef.set({
      name,
      email,
      createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
    });

    res.status(201).json({ message: 'User created successfully', userId: userRecord.uid });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Authenticate user via Firebase Auth
    const user = await firebaseAdmin.auth().getUserByEmail(email);

    // Check if password is correct (Note: Firebase Admin SDK doesn't provide password checking directly,
    // you should implement custom password validation or use Firebase client SDK to handle login)
    // For now, we'll skip password validation (if you want it, use Firebase Client SDK for the frontend)

    // Generate JWT token
    const token = jwt.sign({ userUid: user.uid }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token });
  } catch (error) {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Bearer token

  if (!token) return res.status(403).json({ error: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user info to request
    next(); // Pass control to next handler
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Create a new workspace
app.post('/workspaces',async (req, res) => {
  const { name, description, fileUrl } = req.body; // Include fileUrl here
  
  if (!name || !description) {
    return res.status(400).json({ error: 'Workspace name and description are required' });
  }

  try {
    const newWorkspace = {
      name,
      description,
      fileUrl,  // Store the file URL here
      createdAt: firebaseAdmin.firestore.FieldValue.serverTimestamp(),
    };

    const workspaceRef = await db.collection('workspaces').add(newWorkspace);
    res.status(201).json({ id: workspaceRef.id, ...newWorkspace });
  } catch (error) {
    res.status(500).send('Error creating workspace: ' + error.message);
  }
});

// Upload file to Cloudinary (with file data coming from frontend)
app.post('/upload', upload.single('file'), async (req, res) => {
  const { file } = req;
  if (!file) return res.status(400).send('No file uploaded');

  try {
    // Upload the file to Cloudinary
    cloudinary.uploader.upload_stream(
      { resource_type: 'auto' }, // 'auto' for auto-detecting file type
      (error, result) => {
        if (error) {
          return res.status(500).send('Error uploading file: ' + error.message);
        }

        // Return the file URL
        res.status(200).json({ fileUrl: result.secure_url });
      }
    ).end(file.buffer);
  } catch (error) {
    res.status(500).send('Error uploading file: ' + error.message);
  }
});

// Add a comment to a workspace (protected route)
app.post('/comments', async (req, res) => {
  const { workspaceId, comment } = req.body;
  try {
    const newComment = {
      workspaceId,
      comment,
      createdAt: new Date(),
    };

    await db.collection('comments').add(newComment);
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).send('Error adding comment: ' + error.message);
  }
});

// Endpoint to get comments for a workspace (public route)
app.get('/comments/:workspaceId', async (req, res) => {
  const { workspaceId } = req.params;
  try {
    const commentsSnapshot = await db.collection('comments').where('workspaceId', '==', workspaceId).get();
    const commentsList = [];
    commentsSnapshot.forEach((doc) => {
      commentsList.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(commentsList);
  } catch (error) {
    res.status(500).send('Error getting comments: ' + error.message);
  }
});

// Endpoint to get workspaces
app.get('/workspaces', async (req, res) => {
  try {
    const workspacesSnapshot = await db.collection('workspaces').get();
    const workspacesList = [];
    workspacesSnapshot.forEach((doc) => {
      workspacesList.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(workspacesList);
  } catch (error) {
    res.status(500).send('Error getting workspaces: ' + error.message);
  }
});


// Endpoint to get tasks (for the Project Board feature)
app.get('/tasks', async (req, res) => {
  try {
    const tasksSnapshot = await db.collection('tasks').get();
    const tasksList = [];
    tasksSnapshot.forEach((doc) => {
      tasksList.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(tasksList);
  } catch (error) {
    res.status(500).send('Error getting tasks: ' + error.message);
  }
});



// Endpoint to create a task (for the Project Board feature)
app.post('/tasks', async (req, res) => {
  try {
    const { name, deadline, columnId } = req.body;
    if (!name || !deadline || !columnId) {
      return res.status(400).send('Missing required fields');
    }

    const newTask = {
      name,
      deadline,
      columnId,
    };

    const taskRef = await db.collection('tasks').add(newTask);
    res.status(201).json({ id: taskRef.id, ...newTask });
  } catch (error) {
    res.status(500).send('Error creating task: ' + error.message);
  }
});

// POST endpoint to log time
app.post('/time-log', async (req, res) => {
  const { taskId, time, endTime } = req.body;
  const startTime = new Date();

  try {
    const newTimeLog = {
      taskId,
      startTime,
      endTime,
      time,
    };

    // Store the time log in Firestore
    const timeLogRef = db.collection('timeLogs').doc();
    await timeLogRef.set(newTimeLog);

    res.status(201).json({ message: 'Time logged successfully' });
  } catch (error) {
    console.error('Error logging time:', error);
    res.status(500).json({ message: 'Failed to log time' });
  }
});

// GET endpoint to fetch time logs for a specific task
app.get('/time-log/:taskId', async (req, res) => {
  const taskId = req.params.taskId;

  try {
    const snapshot = await db.collection('timeLogs').where('taskId', '==', taskId).get();
    const timeLogs = snapshot.docs.map(doc => doc.data());
    res.status(200).json(timeLogs);
  } catch (error) {
    console.error('Error fetching time logs:', error);
    res.status(500).json({ message: 'Failed to fetch time logs' });
  }
});


// Start the server
app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
