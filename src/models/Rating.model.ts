import { Model, DataTypes, type InferAttributes, type InferCreationAttributes, Sequelize } from 'sequelize';

export class Rating extends Model<InferAttributes<Rating>, InferCreationAttributes<Rating>> {
    declare tconst: string;
    declare averageRating: number | null;
    declare numVotes: number | null;
}

export function initRatingModel(sequelize: Sequelize) {
    Rating.init({
        tconst: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
        averageRating: { type: DataTypes.FLOAT },
        numVotes: { type: DataTypes.INTEGER }
    }, {
        sequelize,
        tableName: "ratings",
        timestamps: false
    });
}