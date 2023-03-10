import Component from "./base-component.js";
import Autobind from "../decorators/autobind.js";
import * as Project from "../models/project.js";
import * as DragAndDrop from "../models/drag-drop.js";

//Project item class
export default class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements DragAndDrop.Draggable
{
  private project: Project.Project;

  get persons() {
    if (this.project.people === 1) {
      return "1 person";
    } else {
      return `${this.project.people.toString()} persons`;
    }
  }

  constructor(hostId: string, project: Project.Project) {
    super("single-project", hostId, false, project.id);
    this.project = project;

    this.configure();
    this.renderContent();
  }

  @Autobind
  dragStartHandler(e: DragEvent) {
    e.dataTransfer!.setData("text/plain", this.project.id);
    e.dataTransfer!.effectAllowed = "move";
  }

  dragEndHandler(_: DragEvent) {
    console.log("DragEnd");
  }

  configure() {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }

  renderContent() {
    this.element.querySelector("h2")!.textContent = this.project.title;
    this.element.querySelector(
      "h3"
    )!.textContent = ` ${this.persons} assigned.`;
    this.element.querySelector("p")!.textContent = this.project.description;
  }
}
