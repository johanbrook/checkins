import { LoaderFunction } from "custom.env"

export let loader: LoaderFunction = async ({ request, context }) => {
    await context.auth.authenticate('email-link', request, {
        successRedirect: '/',
        failureRedirect: '/login',
    })
}
