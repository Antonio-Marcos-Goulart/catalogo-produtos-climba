import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Categoria } from '../categoria/Categoria';
import { MovimentacaoEstoque } from '../movimentacao/MovimentacaoEstoque';

@Entity('produto')
class Produto {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 150 })
  nome_produto!: string;

  @Column({ type: 'varchar', length: 300 })
  descricao_produto!: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  valor!: string;

  @Column({ type: 'integer' })
  estoque_disponivel!: number;

  @Column({ type: 'boolean', default: true })
  ativo!: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'produto_cadastrado_em' })
  criadoEm!: Date;

  @ManyToOne(() => Categoria, (categoria) => categoria.produtos, { nullable: false })
  @JoinColumn({ name: 'categoria_id' })
  categoria!: Categoria;

  @OneToMany(() => MovimentacaoEstoque, (movimentacao) => movimentacao.produto)
  movimentacoes!: MovimentacaoEstoque[];
}

export { Produto };
