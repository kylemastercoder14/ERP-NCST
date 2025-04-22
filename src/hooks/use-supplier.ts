import db from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

// Since this is running in a server component, we should treat it as a utility, not a hook
export const useSupplier = async () => {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("Authorization");

  if (!authToken) {
    return { error: "Authorization token is missing" };
  }

  try {
    const token = authToken.value;
    // Verify JWT token using the secret
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET!) as {
      sub: string;
      exp: number;
    };

    const userId = decodedToken.sub;

    // Fetch user from database
    const user = await db.supplier.findFirst({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return { error: "User not found" };
    }

    const userType = "Supplier";

    return { user, userId, authToken, userType };
  } catch (error) {
    console.error(error);
    return { error: "Invalid or expired token" };
  }
};
