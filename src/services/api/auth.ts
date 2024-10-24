import { UserLoginScheme } from "../../models/user";
import { TokenResponseScheme } from "../../models/token";
import axios from "./axios";
import { ContentType } from "./axios";

export const onLogin = async (
  data: UserLoginScheme,
) => {
    const response = await axios<TokenResponseScheme>({
      url: `/api/login`, 
      method: "POST",
      headers: { "Content-Type": ContentType.Json },
      data: JSON.stringify(data) 
    });
    return response;
};
  