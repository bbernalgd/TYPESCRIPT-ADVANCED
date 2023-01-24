import Component from "./base-component";
import Autobind from "../decorators/autobind";
import ProjectItem from "../components/project-item";
import * as Project from "../models/project";
import * as Pstate from "../state/project-state";
import * as DragAndDrop from "../models/drag-drop";

//Project List Class
export default class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragAndDrop.DragTarget
{
  assignedProjects: Project.Project[];

  @Autobind
  dragOverHandler(e: DragEvent) {
    if (e.dataTransfer && e.dataTransfer.types[0] === "text/plain") {
      e.preventDefault();
      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  @Autobind
  dropHandler(e: DragEvent) {
    const prjId = e.dataTransfer!.getData("text/plain");
    Pstate.projectState.moveProject(
      prjId,
      this.type === "active"
        ? Project.ProjectStatus.Active
        : Project.ProjectStatus.Finished
    );
  }

  @Autobind
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.assignedProjects = [];

    this.configure();
    this.renderContent();
  }

  configure() {
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);

    Pstate.projectState.addListener((projects: Project.Project[]) => {
      const relevantProjects = projects.filter((prj) => {
        if (this.type === "active") {
          return prj.status === Project.ProjectStatus.Active;
        }
        return prj.status === Project.ProjectStatus.Finished;
      });
      this.assignedProjects = relevantProjects;
      this.renderProjects();
    });
  }

  renderContent() {
    const listId = `${this.type}-project-list`;
    this.element.querySelector("ul")!.id = listId;
    this.element.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
  }

  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-project-list`
    )! as HTMLUListElement;
    listEl.innerHTML = "";
    for (const prjItem of this.assignedProjects) {
      new ProjectItem(this.element.querySelector("ul")!.id, prjItem);
    }
  }
}
