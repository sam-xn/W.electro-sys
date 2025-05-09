import express from 'express'
import cors from 'cors'
import db from './app/models/index.js'

import orderRoutes from './app/routes/order.routes.js'
import jobRoutes from './app/routes/job.routes.js'
import receiptRoutes from './app/routes/receipt.routes.js'
import deliverableRoutes from './app/routes/deliverable.routes.js'
import customerRoutes from './app/routes/customer.routes.js'
import contactRoutes from './app/routes/contact.routes.js'

const app = express();

const corsOptions = {
    origin: ["http://localhost:5175", "http://localhost:5173"]
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.json({ message: "WEMF-DB backend." })
});

orderRoutes(app);
jobRoutes(app);
receiptRoutes(app);
deliverableRoutes(app);
customerRoutes(app);
contactRoutes(app);

db.sequelize.sync().then(() => {
    console.log("Synced db.");
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});