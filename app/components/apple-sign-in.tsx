import AppleSignin from "react-apple-signin-auth";

const APPLE_SERVICE_ID = import.meta.env.VITE_APPLE_SERVICE_ID;
const APPLE_REDIRECT_URI = import.meta.env.VITE_APPLE_REDIRECT_URI;

type Props = {
  onSuccess(token: string): void;
};

export function AppleSignInButton({ onSuccess }: Props) {
  console.log(APPLE_SERVICE_ID, APPLE_REDIRECT_URI);

  const handleSuccess = (data: { authorization: { id_token: string } }) => {
    console.log("HANDLESUCCESS", data);
    const token = data.authorization.id_token;
    onSuccess(token);

    // Here you can send data to your backend service and process the response
    // further based on your requirements
  };

  const authOptions = {
    clientId: APPLE_SERVICE_ID, // This is your service ID
    scope: "name email",
    redirectURI: APPLE_REDIRECT_URI,
    nonce: "nonce",
    usePopup: true, // important to catch up data on the frontend
  };

  return (
    <AppleSignin
      authOptions={authOptions}
      uiType="dark"
      className="apple-auth-btn"
      noDefaultStyle={false}
      onSuccess={handleSuccess}
      onError={(error: string) => console.error(error)}
      buttonExtraChildren=""
    />
  );
}
