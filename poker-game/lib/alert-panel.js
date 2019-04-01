
export function setError({ user, cash }) {
    return `There is a session of user ${user} with cash $${cash}. Please end the current session first.`
}
