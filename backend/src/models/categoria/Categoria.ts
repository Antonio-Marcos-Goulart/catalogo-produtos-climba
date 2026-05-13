import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Produto } from '../produto/Produto';

@Entity('categorias')
class Categoria {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nome!: string;

  @OneToMany(() => Produto, (produto) => produto.categoria)
  produtos!: Produto[];
}

export { Categoria };
