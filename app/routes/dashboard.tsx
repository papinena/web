import { useEffect } from "react";
import { useNavigate } from "react-router";
import { Box } from "~/components/ui/box";
import { Text } from "~/components/ui/text";
import { Button } from "~/components/ui/button";
import { useAuth } from "~/hooks/useAuth";

export default function Dashboard() {
  const navigate = useNavigate();
  const { authData, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }

    // Get user info
    console.log("User authenticated:", authData);
  }, [navigate, authData, isAuthenticated]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box className="flex-1 h-full w-full">
      <Box className="flex  flex-1 flex-col">
        <Box className="relative items-start w-full z-1">
          <Box className="w-full bg-blue-primary h-32" />
        </Box>
        <Box className="p-5 text-center flex-col gap-5 flex rounded-2xl -mt-16 flex-1 z-1 bg-white h-full w-full">
          <Text className="text-2xl font-bold">Dashboard</Text>
          
          <Box className="bg-gray-50 p-5 rounded-lg">
            <Text className="text-lg font-semibold mb-3">User Information</Text>
            <Text>User Type: {authData?.userType}</Text>
            <Text>Token ID: {authData?.tokenId}</Text>
            <Text className="text-sm text-gray-500 mt-2">
              Token: {authData?.token.substring(0, 20)}...
            </Text>
          </Box>

          <Button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600"
          >
            Logout
          </Button>
        </Box>
      </Box>
    </Box>
  );
} 