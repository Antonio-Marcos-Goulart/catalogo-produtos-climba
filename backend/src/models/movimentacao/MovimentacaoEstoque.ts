import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';

import { Produto } from '../produto/Produto';

@Entity('movimentacoes_estoque')
class MovimentacaoEstoque {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 20 })
  tipo!: 'entrada' | 'saida';

  @Column({ type: 'integer' })
  quantidade!: number;

  @Column({ type: 'text', nullable: true })
  observacao?: string;

  @Column({ type: 'boolean', default: false })
  revertida!: boolean;

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'data_movimentacao' })
  dataMovimentacao!: Date;

  @ManyToOne(() => Produto, (produto) => produto.movimentacoes, { nullable: false })
  @JoinColumn({ name: 'produto_id' })
  produto!: Produto;

  @RelationId((movimentacao: MovimentacaoEstoque) => movimentacao.produto)
  produtoId!: number;
}

export { MovimentacaoEstoque };
