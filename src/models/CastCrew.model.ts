import { Model, DataTypes, type InferAttributes, type InferCreationAttributes, Sequelize } from 'sequelize';

export class CastCrew extends Model<InferAttributes<CastCrew>, InferCreationAttributes<CastCrew>> {
    declare tconst: string;
    declare ordering: number;
    declare nconst: string | null;
    declare category: string | null;
    declare job: string | null;
    declare characters: string | null;
}

export function initCastCrewModel(sequelize: Sequelize) {
    CastCrew.init({
        tconst: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
        ordering: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false },
        nconst: { type: DataTypes.STRING },
        category: { type: DataTypes.STRING },
        job: { type: DataTypes.TEXT },
        characters: { type: DataTypes.TEXT } 
    }, {
        sequelize,
        tableName: "cast_crew",
        timestamps: false
    });
}