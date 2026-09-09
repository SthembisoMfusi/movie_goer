import { Model, DataTypes, type InferAttributes, type InferCreationAttributes, Sequelize } from 'sequelize';

export class Person extends Model<InferAttributes<Person>, InferCreationAttributes<Person>> {
    declare nconst: string;
    declare primaryName: string | null;
    declare birthYear: string | null;  
    declare deathYear: string | null;  
    declare primaryProfession: string | null;
    declare knownForTitles: string | null;
}

export function initPersonModel(sequelize: Sequelize) {
    Person.init({
        nconst: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
        primaryName: { type: DataTypes.TEXT },
        birthYear: { type: DataTypes.STRING }, 
        deathYear: { type: DataTypes.STRING }, 
        primaryProfession: { type: DataTypes.TEXT },
        knownForTitles: { type: DataTypes.TEXT }
    }, {
        sequelize,
        tableName: "people",
        timestamps: false
    });}