import { db } from "./index";
import { eq } from "drizzle-orm";
import {
	users,
	comments,
	products,
	type NewUser,
	type NewComment,
	type NewProduct,
} from "./schema";

// User queries

export const createUser = async (data: NewUser) => {
	const [user] = await db.insert(users).values(data).returning();
	return user;
};

export const getUserById = async (id: string) => {
	const user = db.query.users.findFirst({ where: eq(users.id, id) });
	return user;
};

export const updateUserById = async (id: string, data: Partial<NewUser>) => {
	const [user] = await db
		.update(users)
		.set(data)
		.where(eq(users.id, id))
		.returning();

	return user;
};

export const upsertUser = async (data: NewUser) => {
	const existingUser = await getUserById(data.id);
	if (existingUser) return updateUserById(data.id, data);

	return createUser(data);
};

// Product quieries

const createProduct = async (data: NewProduct) => {
	const [product] = await db.insert(products).values(data).returning();
	return product;
};

const getAllProducts = async () => {
	return db.query.products.findMany({
		with: { user: true },
		orderBy: (products, { desc }) => [desc(products.createdAt)],
	});
};

const getProductById = async (id: string) => {
	return db.query.products.findFirst({
		where: eq(products.id, id),
		with: {
			user: true,
			comments: {
				with: { user: true },
				orderBy: (comments, { desc }) => [desc(comments.createdAt)],
			},
		},
	});
};

const getProductsByUserId = async (userId: string) => {
	return db.query.products.findMany({
		where: eq(products.userId, userId),
		with: { user: true },
		orderBy: (products, { desc }) => [desc(products.createdAt)],
	});
};

const updateProductByUserId = async (id: string, data: Partial<NewProduct>) => {
	const [product] = await db
		.update(products)
		.set(data)
		.where(eq(products.id, id))
		.returning();

	return product;
};

const deleteProduct = async (id: string) => {
	return db.delete(products).where(eq(products.id, id)).returning();
};

//Comments queries

const createComment = async (data: NewComment) => {
	const [comment] = await db.insert(comments).values(data).returning();
	return comment;
};

const deletyeComment = async (id: string) => {
	return db.delete(comments).where(eq(comments.id, id)).returning();
};

const fgetCommentById = async (id: string) => {
	return db.query.comments.findFirst({
		where: eq(comments.id, id),
		with: { user: true },
	});
};
