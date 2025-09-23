import { z } from 'zod';
import { Prisma } from '@prisma/client';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';


extendZodWithOpenApi(z);

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = Prisma.JsonValue | null | 'JsonNull' | 'DbNull' | Prisma.NullTypes.DbNull | Prisma.NullTypes.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return Prisma.DbNull;
  if (v === 'JsonNull') return Prisma.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<Prisma.JsonValue> = z.any().openapi({ type: 'object' });

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v))
  .openapi({ type: 'object' });

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<Prisma.InputJsonValue> = z.any().openapi({ type: 'object' });

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const ErrorLogsScalarFieldEnumSchema = z.enum(['id','status','message','method','url','loggedUser','name','stack','details','createdAt','updatedAt']);

export const UsersScalarFieldEnumSchema = z.enum(['id','email','password','roleId','tenantId','name','phoneNumber','bio','resetToken','deletedAt','createdAt','updatedAt']);

export const TenantsScalarFieldEnumSchema = z.enum(['id','name','createdAt','updatedAt']);

export const RolesScalarFieldEnumSchema = z.enum(['id','name','createdAt','updatedAt']);

export const FilesScalarFieldEnumSchema = z.enum(['id','userId','name','path','text','tags','views','createdAt','updatedAt']);

export const ConversationsScalarFieldEnumSchema = z.enum(['id','userId','category','answers','notes','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// ERROR LOGS SCHEMA
/////////////////////////////////////////

export const ErrorLogsSchema = z.object({
  id: z.string(),
  status: z.string().nullable(),
  message: z.string().nullable(),
  method: z.string().nullable(),
  url: z.string().nullable(),
  loggedUser: z.string().nullable(),
  name: z.string().nullable(),
  stack: z.string().nullable(),
  details: JsonValueSchema.nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type ErrorLogs = z.infer<typeof ErrorLogsSchema>

/////////////////////////////////////////
// USERS SCHEMA
/////////////////////////////////////////

export const UsersSchema = z.object({
  id: z.string(),
  email: z.string(),
  password: z.string(),
  roleId: z.string(),
  tenantId: z.string(),
  name: z.string().nullable(),
  phoneNumber: z.string().nullable(),
  bio: z.string().nullable(),
  resetToken: z.string().nullable(),
  deletedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Users = z.infer<typeof UsersSchema>

/////////////////////////////////////////
// TENANTS SCHEMA
/////////////////////////////////////////

export const TenantsSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Tenants = z.infer<typeof TenantsSchema>

/////////////////////////////////////////
// ROLES SCHEMA
/////////////////////////////////////////

export const RolesSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Roles = z.infer<typeof RolesSchema>

/////////////////////////////////////////
// FILES SCHEMA
/////////////////////////////////////////

export const FilesSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string().nullable(),
  path: z.string().nullable(),
  text: z.string().nullable(),
  tags: z.string().nullable(),
  views: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
})

export type Files = z.infer<typeof FilesSchema>

/////////////////////////////////////////
// COMPOSITE TYPES
/////////////////////////////////////////
// MESSAGE
//------------------------------------------------------


/////////////////////////////////////////
// MESSAGE SCHEMA
/////////////////////////////////////////

export const MessageSchema = z.object({
  role: z.string(),
  content: z.string(),
})

export type Message = z.infer<typeof MessageSchema>

/////////////////////////////////////////
// CONVERSATIONS SCHEMA
/////////////////////////////////////////

export const ConversationsSchema = z.object({
  id: z.string(),
  userId: z.string(),
  category: z.string().nullable(),
  answers: JsonValueSchema.nullable(),
  notes: JsonValueSchema.nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  messages: z.array(MessageSchema).optional(),
})

export type Conversations = z.infer<typeof ConversationsSchema>
