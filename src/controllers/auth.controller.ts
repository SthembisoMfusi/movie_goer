import type { FastifyRequest, FastifyReply } from 'fastify';
import bcrypt from 'bcrypt';


export const registerUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { name, password, email } = request.body as { name: string; password: string; email: string };

    if (!name || !password || !email) {
        return reply.status(400).send({ error: 'Name, password, and email are required' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
         const existingUser = await request.server.db.User.findOne({ where: { email } });
        if (existingUser) {
            return reply.status(409).send({ error: 'Email is already in use' });
        }
        const newUser = await request.server.db.User.create({
            name,
            password: hashedPassword,
            email
        });
        return reply.status(201).send({ success: true, userId: newUser.id });
    } catch (error) {
        request.server.log.error(error);
        return reply.status(500).send({ error: 'User registration failed' });
    }

}

export const loginUser = async (request: FastifyRequest, reply: FastifyReply) => {
    const { email, password } = request.body as { email: string; password: string };

    if (!email || !password) {
        return reply.status(400).send({ error: 'Email and password are required' });
    }

    try {
        const user = await request.server.db.User.findOne({ where: { email } });
        if (!user) {
            return reply.status(401).send({ error: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return reply.status(401).send({ error: 'Invalid email or password' });
        }

        
        const token = await reply.jwtSign(
            {userId: user.id},
            {expiresIn: '7d'}
        );
        return reply.send({ success: true, message: 'Login successful', token });
    } catch (error) {
        request.server.log.error(error);
        return reply.status(500).send({ error: 'User login failed' });
    }
}


export const fetchUser = async (request: FastifyRequest, reply: FastifyReply) =>{
    try {
        await request.jwtVerify();

        const decodedToken = request.user as {userId: number};
        const user = await request.server.db.User.findByPk(decodedToken.userId, {
            attributes: ['id', 'name', 'email']
        });
    if (!user){
        return reply.status(400).send({error: 'User not found'})
    }

    return reply.send({ success: true, user})
    } catch (error){
        return reply.status(401).send({ error: 'Unauthorized: Invalid or missing token'});
    }
}

export const deleteUser = async (request: FastifyRequest, reply: FastifyReply) => {
    try {
       await request.jwtVerify();
       const decodedToken = request.user as { userId: number};
       const userId = decodedToken.userId;

       const deletedCount = await request.server.db.User.destroy({
        where: {id: userId}
       });
       if (deletedCount === 0 ){
        return reply.send(404).send({ error: 'User not found'})
       }
       return reply.send({ success: true, message: 'Account successfully deleted'})
        
    } catch (error) {
        return reply.status(401).send({ error: 'Unauthorized' });
    }
}
