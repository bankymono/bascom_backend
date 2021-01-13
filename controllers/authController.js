require("dotenv").config(); // environment config file
const jwt = require("jsonwebtoken"); // jsonwebtoken

// Verify Token
const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // Get auth header value
  if (typeof authHeader === "undefined") return res.sendStatus(403); // Check if authHeader is undefined
  req.token = authHeader; // Set token
  jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, (err, decodedData) => {
    if (err) return res.status(403).json({success:false,message:"Access Denied!"});
    req.user = decodedData; //decoded token data
    next();
  });
};

// Find permission
const can = (action, data) => {
    permission = data.some((x) => x === action);
    return permission;
  };  

  const addUser = (req, res, next) => {
    if (can("add_user", req.user.data.permissions) === true) {
      next();
    } else {
      res.status(403).send("You don't have permission to add a user");
    }
  };

// Check Permission to View User
const viewAllUsers = (req, res, next) => {
  if (can("view_all_users", req.user.data.permissions) === true) {
    next();
  } else {
    res.status(403).json({message:"Forbidden!"});
  }
};

// Check Permission to Edit Users
const editUser = (req, res, next) => {
  if (can("edit_user", req.user.data.permissions) === true) {
    next();
  } else {
    res.status(403).send("You don't have permission to edit a user");
  }
};

// Check Permission to delete Users
const deleteUser = (req, res, next) => {
    if (can("delete_user", req.user.data.permissions) === true) {
      next();
    } else {
      res.status(403).json({message:"Forbidden!"});
    }
};

const manageProject = (req, res, next) => {
    if (can("manage_project", req.user.data.permissions) === true) {
      next();
    } else {
      res.status(403).json({message:"Forbidden!"});
    }
};

const viewAllProjects = (req, res, next) => {
    if (can("view_all_projects", req.user.data.permissions) === true) {
      next();
    } else {
      res.status(403).json({message:"Forbidden!"});
    }
};

const viewAllTeams = (req, res, next) => {
  if (can("view_all_teams", req.user.data.permissions) === true) {
    next();
  } else {
    res.status(403).json({message:"Forbidden!"});
  }
};

// const editProject = (req, res, next) => {
//     if (can("edit_project", req.user.data.permissions) === true) {
//       next();
//     } else {
//       res.status(403).send("You are not authorized to do so!");
//     }
// };

// const deleteProject = (req, res, next) => {
//     if (can("delete_project", req.user.data.permissions) === true) {
//       next();
//     } else {
//       res.status(403).send("You are not authorized to do so!");
//     }
// };

// const createTask = (req, res, next) => {
//     if (can("create_task", req.user.data.permissions) === true) {
//       next();
//     } else {
//       res.status(403).send("You are not authorized to do so!");
//     }
// };

const viewAllTasks = (req, res, next) => {
    if (can("view_all_tasks", req.user.data.permissions) === true) {
      next();
    } else {
      res.status(403).json({message:"Forbidden!"});
    }
};

// const editTask = (req, res, next) => {
//     if (can("edit_task", req.user.data.permissions) === true) {
//       next();
//     } else {
//       res.status(403).send("You are not authorized to do so!");
//     }
// };

// const deleteTask = (req, res, next) => {
//     if (can("delete_task", req.user.data.permissions) === true) {
//       next();
//     } else {
//       res.status(403).send("You are not authorized to do so!");
//     }
// };




// Export modules
module.exports.authenticate = authenticate;
module.exports.addUser = addUser;
module.exports.viewAllUsers = viewAllUsers;
module.exports.editUser = editUser;
module.exports.deleteUser = deleteUser;
module.exports.manageProject = manageProject;
// module.exports.editProject = editProject;
module.exports.viewAllProjects = viewAllProjects;
module.exports.viewAllTeams = viewAllTeams;
// module.exports.deleteProject = deleteProject;
// module.exports.createTask = createTask;
// module.exports.editTask = editTask;
// module.exports.deleteTask = deleteTask;
module.exports.viewAllTasks = viewAllTasks;
