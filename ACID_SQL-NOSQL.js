Single operations are already ACID by default, no explicit transaction needed

Postgres (via Drizzle/Prisma): every single SQL statement runs in an implicit transaction (autocommit mode). A single INSERT/UPDATE is atomic and durable once it returns success — you didn't need to call db.transaction() for that.
MongoDB (via Mongoose): writes to a single document are atomic by default and have been since MongoDB's early versions — even without a session/transaction. This is why so many Mongo schemas try to embed related data in one document, to piggyback on this native atomicity.

Where explicit transactions become necessary

Postgres: when you need atomicity/isolation across multiple statements (e.g., debit one row, credit another, and both must succeed or fail together) — that's when you wrap in BEGIN...COMMIT (or db.transaction() in Drizzle/Prisma).
MongoDB: when you need atomicity across multiple documents or collections — that's when you need a session + startTransaction() (and it requires a replica set/sharded cluster, not a standalone instance).

  On each ACID letter specifically : 
Atomicity — guaranteed per-statement/per-document always; needs a transaction only for multi-statement/multi-document units of work.
Consistency — mostly enforced by schema constraints, unique indexes, foreign keys, validators — these apply regardless of whether you're in a transaction. Transactions help you preserve application-level consistency across multiple related writes, but DB-level consistency isn't "unlocked" by transactions.
Isolation — technically applies to every implicit or explicit transaction; you just don't notice it with single statements because there's nothing concurrent to isolate from within that one operation. It becomes visibly important with concurrent multi-statement transactions, controlled via isolation levels (read committed, repeatable read, serializable, etc.).
Durability — applies once any write is committed/acknowledged, transaction or not (subject to write concern in Mongo, fsync/WAL settings in Postgres).

-------------------------------------------------------------------------Transaction normal code in mongodb ------------------------------------------------
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


------------------------------------------------------------------
