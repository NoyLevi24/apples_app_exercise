# 🍎 Apple Inventory Web Application

This project is a professional DevOps exercise demonstrating a complete lifecycle of a containerized Node.js & MongoDB application. It features automated infrastructure provisioning, configuration management, and a manual CI/CD pipeline.

## 🏗️ Architecture Design

The architecture is designed for modularity and high-tech best practices:
* **Application:** Node.js Express server querying a MongoDB database.
* **Database:** MongoDB instance with automated seeding via `init-db.js`.
* **Containers:** Managed by **Docker Compose** for local and remote consistency.
* **Infrastructure (IaC):** AWS VPC, Subnets, and EC2 provisioned via **Terraform**.
* **Remote State:** State management is handled by **HCP Terraform** to ensure consistency and security.
* **Configuration & Deployment:** **Ansible** configures the OS, installs Docker, and deploys the stack.
* **CI/CD:** Automated via **GitHub Actions** with a manual trigger mechanism.

### 🌐 Network Topology
* **VPC:** `10.0.0.0/16`
* **Public Subnet:** Direct access via Internet Gateway.
* **Security Group:** * Port `3000`: Web Traffic.
    * Port `22`: SSH for Ansible management.

---

## 🛠️ Prerequisites

To run this project, you need:
1. **AWS Account:** Credentials with administrative access.
2. **HCP Terraform Account:** A workspace configured in **Local Execution Mode**.
3. **GitHub Secrets:** The following secrets must be configured in your repository:
    * `AWS_ACCESS_KEY_ID` & `AWS_SECRET_ACCESS_KEY`
    * `TF_API_TOKEN` (From HCP Terraform)
    * `SSH_PRIVATE_KEY` (Content of your `.pem` file)

---

## 🚀 Deployment (Manual CI/CD)

This project uses a **GitOps-ready** approach where the deployment is triggered manually via GitHub Actions.

1. **Push Changes:** Ensure your code is pushed to the `main` branch.
2. **Trigger Pipeline:**
   * Go to the **Actions** tab in your GitHub repository.
   * Select the **"CI/CD Pipeline"** workflow.
   * Click **Run workflow**.
3. **Wait for Completion:** * **Stage 1:** Infrastructure Provisioning (Terraform Apply).
   * **Stage 2:** Configuration & App Deployment (Ansible).
4. **Access the App:** * Check the logs of the Terraform stage or the AWS Console for the Public IP.
   * Open: `http://<instance-public-ip>:3000`

---

## 🧪 Infrastructure & App Verification

* **HCP Terraform:** Monitor the state and run history in your HCP Dashboard.
* **AWS Console:** Verify the EC2 instance "Apples-Web-Server" is running.
* **Application:** The web page should display the message: **"Number of apples in the DB: 5"**.
* **Persistence:** MongoDB uses Docker volumes to ensure data survives container restarts.

---

## 🌟 Advanced Features Implemented
* **Decoupled Workflow:** Terraform manages the hardware; Ansible manages the software.
* **Remote State Management:** Used HCP Terraform to prevent state-lock and ensure team collaboration.
* **Manual Pipeline Trigger:** Implemented `workflow_dispatch` for controlled deployments.
* **Modular Codebase:** Separated Terraform into `providers`, `variables`, and `outputs`.
* **Security First:** Sensitive data is handled via GitHub Secrets; `.gitignore` prevents leaks.

---

## 🧹 Cleanup
To terminate all resources and avoid costs:
```bash
cd terraform
terraform destroy -auto-approve