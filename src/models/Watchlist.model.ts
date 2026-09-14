import { Model, DataTypes, Sequelize } from 'sequelize';
import type { InferAttributes, InferCreationAttributes, CreationOptional } from 'sequelize'


export class Watchlist extends Model<InferAttributes<Watchlist>, InferCreationAttributes<Watchlist>> {
    declare userId: number;
    declare titleId: string;

    // Explicitly declaring the timestamps we created in psql
    declare createdAt: CreationOptional<Date>;
    declare updatedAt: CreationOptional<Date>;
}

export function initWatchlistModel(sequelize: Sequelize) {
    Watchlist.init(
        {
            userId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                allowNull: false
            },
            titleId: {
                type: DataTypes.STRING,
                primaryKey: true,
                allowNull: false
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW
            }
        },
        {
            sequelize,
            tableName: 'watchlists',
            timestamps: true
        }
    );
}