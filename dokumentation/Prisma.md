Jag testade att implementera Prisma i mitt projekt.
Dock så fick jag detta error:

No overload matches this call.
The last overload gave the following error.
Argument of type '(req: Request<{ userId: string; }>, res: Response, next: NextFunction) => Promise<express.Response<any, Record<string, any>> | undefined>' is not assignable to parameter of type 'Application<Record<string, any>>'.
Type '(req: Request<{ userId: string; }, any, any, ParsedQs, Record<string, any>>, res: Response<any, Record<string, any>>, next: NextFunction) => Promise<...>' is missing the following properties from type 'Application<Record<string, any>>': init, defaultConfiguration, engine, set, and 63 more.

Jag försökte i flera timmar att försöka lösa problemet men bestämde mig till sista för att utesluta Prisma i detta projekt
då deadline närmar sig och jag har flera saker att implementera.

Jag har dock försökt att implementera det.
Jag lyckades skapa ett prisma schema och hämta information från databasen:

generator client {
provider = "prisma-client-js"
output = "../src/generated/prisma"
}

datasource db {
provider = "postgresql"
url = env("DATABASE_URL")
}

model comments {
id Int @id @default(autoincrement())
user_id Int?
post_id Int?
content String
created_at DateTime? @default(now()) @db.Timestamp(6)
posts posts? @relation(fields: [post_id], references: [id], onDelete: Cascade, onUpdate: NoAction)
}

model messages {
id Int @id @default(autoincrement())
sender_id Int?
receiver_id Int?
message_body String
timestamp DateTime? @default(now()) @db.Timestamp(6)
}

model notifications {
id Int @id @default(autoincrement())
user_id Int?
type String @db.VarChar(50)
message String
read Boolean? @default(false)
created_at DateTime? @default(now()) @db.Timestamp(6)
}

model posts {
id Int @id @default(autoincrement())
user_id Int?
content String
image_url String? @db.VarChar(255)
created_at DateTime? @default(now()) @db.Timestamp(6)
updated_at DateTime? @default(now()) @db.Timestamp(6)
comments comments[]
users users? @relation(fields: [user_id], references: [id], onDelete: Cascade, onUpdate: NoAction, map: "fk_user")
}

model users {
id Int @id(map: "users_new_pkey") @default(autoincrement())
username String @unique(map: "users_new_username_key") @db.VarChar(255)
firstname String @db.VarChar(50)
lastname String @db.VarChar(50)
email String @unique(map: "users_new_email_key") @db.VarChar(255)
password String @db.VarChar(255)
profile_picture String? @db.VarChar(255)
created_at DateTime? @default(now()) @db.Timestamp(6)
updated_at DateTime? @default(now()) @db.Timestamp(6)
bio String?
cover_image String?
posts posts[]
}

Sen blev det pankaka och error. Men jag gjorde ett gott försök!
