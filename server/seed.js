//require("./common/env");
const dotenv = require("dotenv");

//import Database from "./common/database";
const Component = require("./api/models/component.ts").Component;
const Bom = require("./api/models/bom.ts").Bom;
const InventoryStmt = require ("./api/models/inventoryStmt.ts").InventoryStmt;
const mongoose = require("mongoose");

dotenv.config();

const port = parseInt(process.env.PORT || "3000");
const connectionString =
  process.env.NODE_ENV === "production"
    ? process.env.MONGODB_URI
    : process.env.NODE_ENV === "test"
    ? process.env.MONGODB_URI_TEST ||
      "mongodb://localhost:27017/express-mongoose-template"
    : process.env.MONGODB_URI_DEV ||
      "mongodb://localhost:27017/express-mongoose-template-test";

// it appears that insertMany doesn't trigger the component_id 
// sequence AutoIncrement functionality 
// so we get duplicate null component_id
// create / post / might do it - but not the bulk insertMany
// so we need to manually include this correctly at the moment
//
// And / or once a full seed is set up then also drop the db first 
// and then you can re-use without updating all of the component_id s
// or do a query and then implement logic but not we are not looking at a 
// static thing -- then maybe do like array and create (post) each one 
// with logic
const seedComponents = [
  {
    component_id: 1,          // Make sure this is correct
    name: "CAP CER 0402 0.1u GP BYPASS",
    mfg: "TDK",
    mpn: "CGA2B3X7R1H104K050BB",
    dists: [
      {
        dist: "DK",
        dpn: "445-6899-1-ND"
      }
    ]
  },
  {
    component_id: 2,          // Make sure this is correct
    name: "(?) CAP CER 0603 10u GP BYPASS",
    mfg: "Murata",
    mpn: "GRM188D71A106MA73D",
    dists: [
      {
        dist: "DK",
        dpn: "490-7200-1-ND"
      }
    ]
  },
  {
    component_id: 3,          // Make sure this is correct
    name: "(?) CAP CER 0805 1u HIGH V?",
    mfg: "Samsung",
    mpn: "CL21B105KBFNNNG",
    dists: [
      {
        dist: "DK",
        dpn: "1276-6470-1-ND"
      }
    ]
  }
] // </ seedComponents >

const seedBoms =  [
  {
    bom_id: 1,
    name: "RS104",
    description: "2022 Q3 Q4 Build",
    revision: "R01A",
    lineItems: []
  }
] // </ seedBoms >

const seedInventoryStmts = [
  {
    inventoryStmt_id: 1,
    stmtType: "Hand Count",
    description: "seeded stmt 1",
    isActive: true,
    quantities: [
      {
        quantity: 92,
        // packaging: use default: Cut Tape
        packagingSpec: "PT-8p4mm",
        location: "UT Order"
      }
    ],
    component_id: 1
  },
  {
    inventoryStmt_id: 2,
    stmtType: "On Order",
    description: "seeded stmt 2",
    isActive: true,
    quantities: [
      {
        quantity: 1000,
        // packaging: use default: Cut Tape
        packagingSpec: "PT-8p4mm",
        location: "UT Order"
      }
    ],
    component_id: 2
  }
]

const seedDb = async () => {
  
  // Components
  console.log('deleteMany({}) Components');
  await Component.deleteMany({});
  console.log('insertMany Components from seedComponents');
  await Component.insertMany(seedComponents);
  
  // BOMs
  console.log('deleteMany and then insertMany Boms from seedBoms');
  await Bom.deleteMany({});
  await Bom.insertMany(seedBoms);

  // Inventory Stmts
  console.log('deleteMany and then insertMany inventoryStmts from seedInventoryStmts');
  await InventoryStmt.deleteMany({});
  await InventoryStmt.insertMany(seedInventoryStmts);

}

mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    user: process.env.DB_USER,
    pass: process.env.DB_PASS,
  })
  .then(() => {
    console.log("Database connected.");
    Component.collection.getIndexes({full: true}).then(indexes => {
      console.log("indexes:", indexes);
    }).catch(console.error); // TODO also now sync clean up for the InventoryStmt indexes
    Component.syncIndexes().then ( () => { // this is to get rid of duplicate or old indexes that break the insert process
      // seedDb().then( () => {
      //   mongoose.connection.close();
      // });
    });
    InventoryStmt.collection.getIndexes({full: true}).then(indexes => {
      console.log("indexes:", indexes);
    }).catch(console.error); // TODO also now sync clean up for the InventoryStmt indexes
    InventoryStmt.syncIndexes().then ( () => { // this is to get rid of duplicate or old indexes that break the insert process
      // seedDb().then( () => {
      //   mongoose.connection.close();
      // });
    });
    Bom.collection.getIndexes({full: true}).then(indexes => {
      console.log("indexes:", indexes);
    }).catch(console.error); // TODO also now sync clean up for the InventoryStmt indexes
    Bom.syncIndexes().then ( () => { // this is to get rid of duplicate or old indexes that break the insert process
      seedDb().then( () => {
        mongoose.connection.close();
      });
    });
  })
  .catch((err) => {
    console.error(
      "MongoDB connection error. Please make sure MongoDB is running.\n" +
        err
    );
    //process.exit(1);
  });
