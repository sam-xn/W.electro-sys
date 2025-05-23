import dbConfig from '../config/db.js'
import Sequelize from 'sequelize'

import Contact from './contact.model.js'
import Customer from './customer.model.js'
import Order from './order.model.js'
import OrderNote from './order_note.model.js'
import Job from './job.model.js'
import Tag from './tag.model.js'
import Receipt from './receipt.model.js'
import ReceiptNote from './receipt_note.model.js'
import Deliverable from './deliverable.model.js'

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD,
    {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        define: { timestamps: false }
    }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.contacts = Contact(sequelize, Sequelize);
db.customers = Customer(sequelize, Sequelize);
db.orders = Order(sequelize, Sequelize);
db.order_notes = OrderNote(sequelize, Sequelize);
db.jobs = Job(sequelize, Sequelize);
db.tags = Tag(sequelize, Sequelize);
db.receipts = Receipt(sequelize, Sequelize);
db.receipt_notes = ReceiptNote(sequelize, Sequelize);
db.deliverables = Deliverable(sequelize, Sequelize);

export default db;