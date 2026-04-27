import NextAuth from "next-auth"
import Keycloak from "next-auth/providers/keycloak"

export const { handlers, signIn, signOut, auth } = NextAuth({
    debug: true,
    providers: [Keycloak({
        clientId: process.env.AUTH_KEYCLOAK_ID!,
        clientSecret: process.env.AUTH_KEYCLOAK_SECRET!,
        issuer: process.env.AUTH_KEYCLOAK_ISSUER!,

        authorization: {
            url: "http://localhost:10000/realms/houseshi/protocol/openid-connect/auth",
        },

        // 👇 used by server (Docker network)
        wellKnown:
            "http://keycloak:8080/realms/houseshi/.well-known/openid-configuration",

        token:
            "http://keycloak:8080/realms/houseshi/protocol/openid-connect/token",

        userinfo:
            "http://keycloak:8080/realms/houseshi/protocol/openid-connect/userinfo",
    })],
})