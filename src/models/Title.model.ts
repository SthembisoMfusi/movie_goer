import { Model, DataTypes, type InferAttributes, type InferCreationAttributes, Sequelize } from 'sequelize';

export class Title extends Model<InferAttributes<Title>, InferCreationAttributes<Title>> {
    declare tconst: string;
    declare titleType: string | null;
    declare primaryTitle: string | null;
    declare originalTitle: string | null;
    declare isAdult: string | null;
    declare startYear: string | null;      
    declare endYear: string | null;        
    declare runtimeMinutes: string | null; 
    declare genres: string | null;
}

export function initTitleModel(sequelize: Sequelize) {
    Title.init({
        tconst: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
        titleType: { type: DataTypes.STRING },
        primaryTitle: { type: DataTypes.TEXT },
        originalTitle: { type: DataTypes.TEXT },
        isAdult: { type: DataTypes.STRING },
        startYear: { type: DataTypes.STRING },      
        endYear: { type: DataTypes.STRING },        
        runtimeMinutes: { type: DataTypes.STRING }, 
        genres: { type: DataTypes.TEXT }
    }, {
        sequelize,
        tableName: "titles",
        timestamps: false
    });
}