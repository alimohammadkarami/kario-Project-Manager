import { ProjectsEmpty } from "./ProjectsEmpty";
export const Home = () => {
    const IsDataAvailable = true;
    return (
        IsDataAvailable ? (
        <div>
            <h1>Home</h1>
        </div>

        ) : (
            <ProjectsEmpty />
        )
    )
}