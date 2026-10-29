
import express, { Request, Response } from "express";
import { Item } from "./models/items";

const app = express();
const PORT = 3000;

app.use(express.json());

// Temporary in-memory storage
const items: Item[] = [];
let nextId = 1;

// Check that the API is running
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Shopping List API is running!"
  });
});

// SPRINT 2: Get all shopping items
app.get("/items", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: items
  });
});

// SPRINT 2: Create a shopping item
app.post("/items", (req: Request, res: Response) => {
  const body = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({
      success: false,
      message: "Request body must be a JSON object."
    });
  }

  const { name, quantity, purchased } = body;

  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Name is required and must be a non-empty string."
    });
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({
      success: false,
      message: "Quantity must be a positive integer."
    });
  }

  if (purchased !== undefined && typeof purchased !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "Purchased must be true or false."
    });
  }

  const newItem: Item = {
    id: nextId++,
    name: name.trim(),
    quantity,
    purchased: purchased ?? false
  };

  items.push(newItem);

  return res.status(201).json({
    success: true,
    message: "Shopping item created successfully.",
    data: newItem
  });
});

// SPRINT 3: Get one shopping item by ID
app.get("/items/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Item ID must be a positive integer."
    });
  }

  const item = items.find((item) => item.id === id);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Shopping item not found."
    });
  }

  return res.status(200).json({
    success: true,
    data: item
  });
});

// SPRINT 3: Update a shopping item by ID
app.put("/items/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Item ID must be a positive integer."
    });
  }

  const item = items.find((item) => item.id === id);

  if (!item) {
    return res.status(404).json({
      success: false,
      message: "Shopping item not found."
    });
  }

  const body = req.body;

  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return res.status(400).json({
      success: false,
      message: "Request body must be a JSON object."
    });
  }

  const { name, quantity, purchased } = body;

  if (typeof name !== "string" || name.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "Name is required and must be a non-empty string."
    });
  }

  if (!Number.isInteger(quantity) || quantity <= 0) {
    return res.status(400).json({
      success: false,
      message: "Quantity must be a positive integer."
    });
  }

  if (typeof purchased !== "boolean") {
    return res.status(400).json({
      success: false,
      message: "Purchased must be true or false."
    });
  }

  item.name = name.trim();
  item.quantity = quantity;
  item.purchased = purchased;

  return res.status(200).json({
    success: true,
    message: "Shopping item updated successfully.",
    data: item
  });
});

// SPRINT 4: Delete a shopping item by ID
app.delete("/items/:id", (req: Request, res: Response) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id) || id <= 0) {
    return res.status(400).json({
      success: false,
      message: "Item ID must be a positive integer."
    });
  }

  const itemIndex = items.findIndex((item) => item.id === id);

  if (itemIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Shopping item not found."
    });
  }

  items.splice(itemIndex, 1);

  return res.status(204).send();
});

// Start the server AFTER registering all routes
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
