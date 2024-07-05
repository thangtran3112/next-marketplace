import { useRouter } from "next/navigation";
import { toast } from "sonner";

export const useAuth = () => {
  const router = useRouter();

  const signOut = async () => {
    try {
      const res = await fetch(
        //this endpoint /api/users/logout is set automatically by Payload
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) throw new Error("Failed to sign out");
      toast.success("Signed out successfully!");

      router.push("/sign-in");
      router.refresh(); //refresh to show the most current state of the app
    } catch (err) {
      toast.error("Could not sign out. Please try again.");
    }
  };

  return { signOut };
};
