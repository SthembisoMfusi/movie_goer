import { app } from '../src/app.js';

async function seedDatabaseForCI() {
    
    
   
    await app.ready();

  
    console.log('Building empty tables...');
    await app.db.sequelize.sync({ force: true });

    
    console.log('Inserting Mock Movies and People...');
    
 
    await app.db.Title.create({
        tconst: 'tt0133093', primaryTitle: 'The Matrix', titleType: 'movie'
    });

  
    await app.db.Title.create({
        tconst: 'tt0111161', primaryTitle: 'The Shawshank Redemption', titleType: 'movie'
    });
    await app.db.Rating.create({ tconst: 'tt0111161', averageRating: 9.3, numVotes: 2000000 });

  
    await app.db.Title.create({
        tconst: 'tt0078346', primaryTitle: 'Superman', titleType: 'movie'
    });

    await app.db.Person.create({
        nconst: 'nm0000151', primaryName: 'Morgan Freeman'
    });


    await app.db.CastCrew.create({
        tconst: 'tt0111161', nconst: 'nm0000151', ordering: 1, category: 'actor'
    });

    console.log('✅ CI Database Seeded Successfully!');
    await app.close();
}

seedDatabaseForCI().catch(err => {
    console.error(err);
    process.exit(1);
});