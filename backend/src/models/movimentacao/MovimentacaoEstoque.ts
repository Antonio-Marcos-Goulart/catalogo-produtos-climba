import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
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

  @CreateDateColumn({ type: 'timestamp with time zone', name: 'data_movimentacao' })
  dataMovimentacao!: Date;

  @ManyToOne(() => Produto, (produto) => produto.movimentacoes, { nullable: false })
  @JoinColumn({ name: 'produto_id' })
  produto!: Produto;
}

export { MovimentacaoEstoque };
