import express from 'express'
import cors from 'cors'
import db from './app/models/index.js'

import contactRoutes from './app/routes/contact.routes.js'
import customerRoutes from './app/routes/customer.routes.js'
import orderRoutes from './app/routes/order.routes.js'
import orderNoteRoutes from './app/routes/order_note.routes.js'
import jobRoutes from './app/routes/job.routes.js'
import receiptRoutes from './app/routes/receipt.routes.js'
import receiptNoteRoutes from './app/routes/receipt_note.routes.js'
import deliverableRoutes from './app/routes/deliverable.routes.js'

const app = express();

const corsOptions = {
    origin: ["http://localhost:5175", "http://localhost:5173"]
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "WEMF-DB." })
});

contactRoutes(app);
customerRoutes(app);
orderRoutes(app);
orderNoteRoutes(app);
jobRoutes(app);
receiptRoutes(app);
receiptNoteRoutes(app);
deliverableRoutes(app);

db.sequelize.sync().then(() => {
    console.log("Synced db.");
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});