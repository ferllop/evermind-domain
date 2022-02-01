export const Config = {
    enablePreconditions: true,
    postgresPassword: process.env.PGPASSWORD,
    persistenceType: process.env.EVERMIND_PERSISTENCE_TYPE,
}
