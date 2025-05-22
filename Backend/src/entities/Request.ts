import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Software } from "./Software";

export enum RequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export enum AccessLevel {
  READ = "READ",
  WRITE = "WRITE",
  ADMIN = "ADMIN",
}

@Entity()
export class Request {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User)
  requester!: User;

  @ManyToOne(() => Software)
  software!: Software;

  @Column({
    type: "enum",
    enum: RequestStatus,
    default: RequestStatus.PENDING,
  })
  status!: RequestStatus;

  @Column({
    type: "enum",
    enum: AccessLevel,
  })
  accessType!: AccessLevel;

  @Column("text")
  reason!: string;

  @Column({ nullable: true, type: "text" })
  managerComment?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
