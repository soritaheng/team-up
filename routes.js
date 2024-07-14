const express = require("express");
const router = express.Router();
const sqlite3 = require("sqlite3").verbose();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const db = new sqlite3.Database("./kando.db", (err) => {
    if (err) {
        console.error(err.message);
    }
});

router.get("/projects", (req, res) => {
    db.all("SELECT * FROM projects", (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Internal server error");
        } else {
            res.send(rows);
        }
    });
});

router.get("/projects/:projectId", (req, res) => {
    const projectId = req.params.projectId
    db.all("SELECT * FROM projects WHERE id = ?", [projectId], (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).send("Internal server error");
        } else {
            res.send(rows[0]);
        }
    });
});

router.post("/projects", (req, res) => {
    const { item } = req.body;
    const sql = `
        INSERT INTO projects (item)
        VALUES (?)
    `;
    db.run(sql, [item], async function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ projectId: this.lastID });
    });
});

router.delete("/projects/:projectId", (req, res) => {
    const projectId = req.params.projectId;

    // SQL query to delete a task by ID
    const sql = `
        DELETE FROM projects
        WHERE id = ?
    `;

    db.run(sql, projectId, function (err) {
        if (err) {
            console.error("Error deleting task:", err.message);
            res.status(500).json({ error: "Failed to delete project" });
            return;
        }
        res.json({ message: "Project deleted successfully" });
    });
});

router.get("/projects/:projectId/tasks", (req, res) => {
    const projectId = req.params.projectId;

    // SQL query to retrieve tasks for a specific project
    const sql = `
        SELECT * FROM tasks
        WHERE project_id = ?
    `;

    db.all(sql, [projectId], (err, rows) => {
        if (err) {
            console.error("Error retrieving tasks:", err.message);
            res.status(500).json({ error: "Failed to retrieve tasks" });
            return;
        }
        res.json({ tasks: rows });
    });
});

router.post("/projects/:projectId/tasks", (req, res) => {
    const projectId = req.params.projectId;
    const { title, completed } = req.body;
    console.log(projectId, title, completed)
    const sql = `
        INSERT INTO tasks (project_id, title, completed)
        VALUES (?, ?, ?)
    `;
    db.run(sql, [projectId, title, completed], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'Successfully added task!' });
    });
});

router.delete("/projects/:projectId/tasks/:taskId", (req, res) => {
    const taskId = req.params.taskId;

    // SQL query to delete a task by ID
    const sql = `
        DELETE FROM tasks
        WHERE id = ?
    `;

    db.run(sql, taskId, function (err) {
        if (err) {
            console.error("Error deleting task:", err.message);
            res.status(500).json({ error: "Failed to delete task" });
            return;
        }
        res.json({ message: "Task deleted successfully" });
    });
});

router.put("/projects/:projectId/tasks/:taskId", (req, res) => {
    const taskId = req.params.taskId;
    const { item, completed } = req.body;

    // SQL query to update a task by ID
    const sql = `
        UPDATE tasks
        SET title = ?, completed = ?
        WHERE id = ?
    `;

    db.run(sql, [taskId, item, completed], function (err) {
        if (err) {
            console.error("Error updating task:", err.message);
            res.status(500).json({ error: "Failed to update task" });
            return;
        }
        res.json({ message: "Task updated successfully" });
    });
});

router.post("/generate", async (req, res) => {
    // const tasks = [
    //     " Define the chatbot's purpose and target audience",
    //     " Choose a suitable AI model (e.g., GPT-3, Dialogflow, Rasa)",
    //     " Gather training data for the chatbot (e.g., text conversations, FAQs)",
    //     " Prepare the data for training the AI model",
    //     " Train the AI model",
    //     " Design the chatbot's user interface (UI)",
    //     " Integrate the AI model with the UI",
    //     " Implement conversation flow logic and branching",
    //     " Test the chatbot's functionality and accuracy",
    //     " Deploy the chatbot to a platform (e.g., website, messaging app)",
    //     " Monitor the chatbot's performance and collect user feedback",
    //     " Continuously improve the chatbot based on feedback and new data.",
    // ];

    const tasks = []

    const prompt = `You are a helpful assistant who is skilled at breaking down actionable tasks for software projects. Return a todo-list of tasks (without headings) for this project: ${req.body.item}.

    Example response format:
    - Task 1
    - Task 2
    .
    .
    .
    - Task n
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const textArr = text.split(/\r?\n/);
    for (i = 0; i < textArr.length - 1; i++) {
        tasks.push(textArr[i].slice(1, textArr[i].length - 1));
    }
    res.json(tasks);
});

module.exports = router;
