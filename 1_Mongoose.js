/*----Comparison Query Operators----*/
$eq, $gt, $gte, $in, $lt, $lte, $ne, $nin


await model.find({ price: { $gt:100, $lt:500 } ); // display the propperties whose price are greater than 100 and less than 500
await model.find({ type: { $in: ["apple","redmi"] }) // select those whose type are apple and redmi



/*----limit & select----*/

// show any 5 properties whose name is apple
await model.find({ name: "apple" }).limit(5);

// find the price whose type is apple( find only price )
await model.find({ type: "apple" }).select({ price: 1 })


/*----Logical Query Operators----*/
$and $not $nor $or


// show the details whose subject is backend or stream is IT
await model.find({ $or: [{subject:"bakend"},{stream:"IT"}] })
same as all....


/*----count documents----*/
note tehat: count() function is depricated

// count how many apple phones are present in the model
await model.find({ type: "apple" }).countDocuments();




/*----ascending to decending----*/

// sort price field ascending to decending order
await model.find().sort({price:1});

// sort price field decending to ascending order
await model.find().sort({price:-1});


/*----update any document----*/
note that: findByIdAndUpdate() is depricated

await model.updateOne({ _id: id }, { $set: req.body }, { new: true })
same as updateMany()



/*----delete any document----*/

await model.deleteOne({ _id: document id }) // delete only is not return the deleted document
same as deleteMany()

await model.findByIdAndDelete({ _id: document id }) // after delete returm the deleted document



/*----mongoose built in----*/

Read More:
https://mongoosejs.com/docs/validation.html
https://mongoosejs.com/docs/schematypes.html

* note that unique is not a validator

const userSchema = new mongoose.Schema({
	userName: {
		type: String,
		required: true,
		unique: true,
		lowercase: true,
		trim: true, // it removes starting and ending spaces,
		minlength: 3, //work only with string
		maxlength: 12
	}
})



/*----/*----What are hooks in Mongoose ----*/----*/
//Hooks Type ---> 1. pre hooks 2. post hooks

//Example of pre hook :
            // so we have a password and confirm password and after that we can save user data so before save data we need to check password and confirm password
	    Schema.pre('name',()=>{});
//Example of post: 
             Schema.pre('name',()=>{});


/*----/*----populate in mongodb----*/----*/
//It is kinda Joint with Foreign key concept in normal SQL

----------------------------------          ------------------------------------
|         Student Schema         |          |            Course Detail         |
----------------------------------          ------------------------------------
|  Name      |      Rounak       |          |   ID           |    1            |
|---------------------------------          ------------------------------------
|  Age       |      22           |          |   Name         |    Mongo DB     |
|---------------------------------          ------------------------------------
|  Course    |     1             |          |  Hours         |     40 Min      |
|---------------------------------          ------------------------------------

Looks as Data : 
   {
     objectID : "dfbebf455",
     name : "Rounak",
     age : 22,
     course : {
               objectID : "ddjbfbe64645",
	       name : "MongoDB",
	       Hours: "40 Min"
         }
   }
   
Look in Code :
     //1. Create model First
     
      const Student= new mongoose.Schema({
                 name: {type: string}.
		 age: {type: number},
		 course: { // we use populate to get all data of course of that ID
		     type: mongoose.Schema.Types.objectID, // alternate way(mongoose.SchemaTypes.objectId)
		     ref: "couse" // course model name
		 },
                 marks: (v)=> {v%2===0} ; // valudation function
      });
      
      //2. Make APIs
        student.create({
	  course : req.body.courseID,
	  
	});

Inner Populate 

Scenario Explanation
Project Schema references the User model.

const mongoose = require("mongoose");
const { Schema } = mongoose;
const ProjectSchema = new Schema({
  name: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User
  status: { type: mongoose.Schema.Types.ObjectId, ref: "Status" } // Reference to Status
});
const Project = mongoose.model("Project", ProjectSchema);
Status Schema references the User model.


const StatusSchema = new Schema({
  state: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // Reference to User
});
const Status = mongoose.model("Status", StatusSchema);
User Schema is standalone (no references here).


const UserSchema = new Schema({
  name: String,
  email: String,
});
const User = mongoose.model("User", UserSchema);

Querying and Populating
To populate user and status data from a Project instance, use populate as follows:

Example Query:
javascript
Copy code
const getProjectWithDetails = async (projectId) => {
  try {
    const project = await Project.findById(projectId)
      .populate("user") // Populates user data in the project
      .populate({
        path: "status", // Populates status data
        populate: {
          path: "user", // Populates user data inside the status
          model: "User",
        },
      });
    return project;
  } catch (error) {
    console.error("Error fetching project details:", error);
    throw error;
  }
};

Explanation of .populate Chain:
.populate("user"):
Fetches the user data directly linked to the project collection.
.populate({ path: "status", populate: { path: "user" } }):

Fetches the status data linked to the project collection.
Then, fetches the user data referenced within the status document.
Example Output:
For a project with this structure:


{
  "_id": "projectId",
  "name": "Project A",
  "user": {
    "_id": "userId1",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "status": {
    "_id": "statusId1",
    "state": "In Progress",
    "user": {
      "_id": "userId2",
      "name": "Jane Smith",
      "email": "jane@example.com"
    }
  }
}


// Advance features of Mongodb 
// MongoDB
// │
// ├── 1. Document Database
// │      └── BSON / JSON-like documents
// │
// ├── 2. Aggregation
// │      └── Complex data processing / analytics
// │
// ├── 3. Transactions
// │      └── ACID transactions
// │
// ├── 4. Geospatial
// │      └── Location / nearby / radius queries
// │
// ├── 5. Vector Search
// │      └── AI semantic search / embeddings
// │
// ├── 6. Full-Text Search
// │      └── Text search, fuzzy search, autocomplete
// │
// ├── 7. Graph-like Queries
// │      └── $graphLookup / relationship traversal
// │
// ├── 8. Time-Series
// │      └── Sensor data, metrics, logs, financial data
// │
// ├── 9. Change Streams
// │      └── Listen to database changes in real time
// │
// ├── 10. GridFS
// │       └── Store large files inside MongoDB
// │
// ├── 11. TTL Index
// │       └── Automatically delete documents after a time
// │
// └── 12. Schema Validation
//        └── Enforce structure/types when needed
// Transaction

const session = await mongoose.startSession();

try {
    await session.withTransaction(async () => {

        const user = await User.findById(userId).session(session);

        user.balance -= 100;
        await user.save({ session });

        const wallet = new Wallet({
            userId,
            amount: 100
        });

        await wallet.save({ session });
    });

    res.json({ success: true });

} catch (error) {
    res.status(500).json({
        success: false,
        message: error.message
    });
} finally {
    await session.endSession();
}




------------------------------Mognodb advance -----------------------------------------
MongoDB vs Neo4j -> mongodb supports some graphdb things also
Feature	                        MongoDB	                           Neo4j
Store nodes/entities	          ✅ Documents	                    ✅ Nodes
Store relationships	            ✅ References / IDs	            ✅ First-class relationships
Traverse relationships	        ✅ $graphLookup	            ✅ Excellent
Recursive traversal	            ✅ $graphLookup	            ✅ Excellent
Shortest path	                  ❌ Not native like Neo4j	          ✅
Complex graph algorithms	      ❌ Limited             	          ✅
Cypher query language	          ❌	                                ✅
Graph-specific optimization	    ❌	                                ✅
General document storage	      ✅ Excellent	                      ⚠️ Not its main purpose

smallest practical Mongoose example using $graphLookup
const employeeSchema = new mongoose.Schema({
  name: String,
  managerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee"
  }
});

const Employee = mongoose.model("Employee", employeeSchema);

//Query
const result = await Employee.aggregate([
  {
    $match: { name: "Manager" }
  },
  {
    $graphLookup: {
      from: "employees",
      startWith: "$_id",
      connectFromField: "_id",
      connectToField: "managerId",
      as: "subordinates"
    }
  }
]);
// Result 
{
  name: "Manager",
  subordinates: [
    { name: "Developer" }
  ]
}



--------------------------------vector------------------------------------
//schema
const productSchema = new mongoose.Schema({
  name: String,
  embedding: [Number]
});
productSchema.index({
  embedding: "vectorSearch"
});
const Product = mongoose.model("Product", productSchema);
//controller
app.get("/search", async (req, res) => {
  const queryVector = [0.12, 0.45, 0.78];
  const result = await Product.aggregate([
    {
      $vectorSearch: {
        index: "product_vector_index",
        path: "embedding",
        queryVector,
        numCandidates: 100,
        limit: 5
      }
    }
  ]);
  res.json(result);
});


----------------------------------Full-Text Search---------------------------------------------------
//schema
const articleSchema = new mongoose.Schema({
  title: String,
  content: String
});
articleSchema.index({
  title: "text",
  content: "text"
});
const Article = mongoose.model("Article", articleSchema);
//controller
app.get("/search", async (req, res) => {
  const result = await Article.find({
    $text: {
      $search: req.query.q
    }
  });

  res.json(result);
});



---------------------------------------Time-Series------------------------------------
//usage 
/**
 * Think of this example - Suppose you have 1000 temperature sensors.
 * Every sensor sends temperature every minute:

 *  10:00 → sensor-01 → 32.5°C
 *  10:01 → sensor-01 → 32.7°C
 *  10:02 → sensor-01 → 32.4°C
 *  10:03 → sensor-01 → 32.8°C
 *  ...

 *  You will have millions of records over time.

 *  That's where a Time-Series Collection is useful.
 */
const sensorSchema = new mongoose.Schema({
  timestamp: Date,
  temperature: Number,
  sensorId: String
});
const Sensor = mongoose.model("Sensor", sensorSchema);

await mongoose.connection.createCollection("sensors", { //Now sensors is a time-series collection.
  timeseries: {
    timeField: "timestamp",
    metaField: "sensorId",
    granularity: "minutes"
  }
});

await Sensor.create({
  timestamp: new Date(),
  sensorId: "sensor-01",
  temperature: 32.5
});

-------------------------------------------Change Streams(realtime change)------------------------------------
const changeStream = User.watch();

changeStream.on("change", (change) => {
  console.log("Database changed:", change); //"MongoDB, tell my Node.js application whenever something changes in the users collection."
});

// For example:

// User created
//      ↓
// MongoDB
//      ↓
// Change Stream
//      ↓
// Node.js receives event

----------------------------------------Gridfs(Used for storing large files in MongoDB)-------------------------
const { GridFSBucket } = require("mongodb");
const bucket = new GridFSBucket(
  mongoose.connection.db,
  { bucketName: "files" }
);

//uploda
const uploadStream = bucket.openUploadStream("video.mp4");
fs.createReadStream("./video.mp4")
  .pipe(uploadStream);
//download
bucket
  .openDownloadStreamByName("video.mp4")
  .pipe(res);





----------------------------------TTL---------------------------
//inline index
const sessionSchema = new mongoose.Schema({
  userId: String,
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 3600
  }
});
// or,
// TTL as index as well 
const sessionSchema = new mongoose.Schema({
  userId: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
sessionSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 3600 }
);
const Session = mongoose.model("Session", sessionSchema);
