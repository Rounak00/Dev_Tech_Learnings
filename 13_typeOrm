/*============= BASIC OPERATIONS =============*/

// FIND
await repo.find();                      // All
await repo.findOneBy({ id });           // By ID
await repo.find({ where: { name: "apple" }, take: 5 }); // Limit 5

// FIND WITH SELECT
await repo.find({ where: { type: "apple" }, select: ["price"] }); // Only price

// COUNT
await repo.count({ where: { type: "apple" } }); // Count documents

// SORT
await repo.find({ order: { price: "ASC" } });   // Ascending
await repo.find({ order: { price: "DESC" } });  // Descending

// INSERT / SAVE
await repo.save({ name: "New Item", price: 100 }); // Insert/update

// UPDATE
await repo.update(id, { name: "Updated" });        // Update one
await repo.update({ type: "apple" }, { price: 999 }); // Update many

// DELETE
await repo.delete(id);                         // Delete one
await repo.delete({ type: "redmi" });          // Delete many

/*============= QUERY OPERATORS =============*/

import { In, Between } from "typeorm";

// Comparison: price > 100 AND price < 500
await repo.find({ where: { price: Between(100, 500) } });

// In array
await repo.find({ where: { type: In(["apple", "redmi"]) } });

// Logical OR
await repo.find({ where: [{ subject: "backend" }, { stream: "IT" }] });

// Logical AND
await repo.find({ where: { subject: "backend", stream: "IT" } });

/*============= ENTITY EXAMPLE =============*/

@Entity()
class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 12 })
  userName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  password: string;

  @OneToOne(() => Profile, profile => profile.user, { cascade: true })
  @JoinColumn()
  profile: Profile;

  @OneToMany(() => Post, post => post.user)
  posts: Post[];
}

/*============= HOOKS =============*/

@BeforeInsert()
hashPassword() {
  this.password = hash(this.password);
}

/*============= RELATION TYPES =============*/

// OneToOne
@Entity()
class Profile {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  bio: string;

  @OneToOne(() => User, user => user.profile)
  user: User;
}

// OneToMany / ManyToOne
@Entity()
class Post {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  content: string;

  @ManyToOne(() => User, user => user.posts)
  user: User;
}

// ManyToMany
@Entity()
class Student {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Course, course => course.students)
  @JoinTable()
  courses: Course[];
}

@Entity()
class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => Student, student => student.courses)
  students: Student[];
}

/*============= POPULATE (RELATIONS) =============*/

// Basic populate (JOIN)
await userRepo.find({ relations: ["profile", "posts"] });

// Nested populate
await projectRepo.findOne({
  where: { id: 1 },
  relations: {
    user: true,
    status: { user: true },
  },
});

/*============= QUERY BUILDER =============*/

await repo.createQueryBuilder("p")
  .leftJoinAndSelect("p.user", "u")
  .where("u.name = :name", { name: "John" })
  .getMany();

/*============= RELATION SUMMARY =============*/

| Type           | Decorator          | Notes                         |
|----------------|---------------------|-------------------------------|
| OneToOne       | @OneToOne + @JoinCol| Use @JoinColumn on one side  |
| OneToMany      | @OneToMany          | Inverse: @ManyToOne          |
| ManyToMany     | @ManyToMany + @JoinTable | Must add @JoinTable    |

