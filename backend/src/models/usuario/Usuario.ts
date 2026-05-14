import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("usuarios")
class Usuario {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 120 })
  nome!: string;

  @Column({ type: "varchar", length: 160, unique: true })
  email!: string;

  @Column({ type: "varchar", length: 255 })
  senha!: string;

  @CreateDateColumn({ type: "timestamp with time zone", name: "criado_em" })
  criadoEm!: Date;
}

export { Usuario };
