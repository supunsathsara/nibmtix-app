import { makeRedirectUri } from "expo-auth-session";
import * as QueryParams from "expo-auth-session/build/QueryParams";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";

import { router } from "expo-router";
import { supabase } from "../../utils/supabase";
import Loader from "../components/Loader";

WebBrowser.maybeCompleteAuthSession(); // required for web only
const redirectTo = makeRedirectUri();

const createSessionFromUrl = async (url) => {
  const { params, errorCode } = QueryParams.getQueryParams(url);

  if (errorCode) throw new Error(errorCode);
  const { access_token, refresh_token } = params;

  if (!access_token) return;

  const { data, error } = await supabase.auth.setSession({
    access_token,
    refresh_token,
  });
  if (error) throw error;
  router.replace("/home");
  //return data.session;
};

export default function Auth() {
  // Handle linking into app from email app.
  const url = Linking.useURL();
  if (url) createSessionFromUrl(url);

  return (
    <>
      <Loader isLoading={true} />
    </>
  );
}
