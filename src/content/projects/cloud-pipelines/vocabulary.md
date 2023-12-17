## Airflow vocabulary

- Task or Operator: A defined unit of work.
- Task instance: An individual run of a single task. The states could be running, success, failed, skipped, and up for retry.
- DAG (Directed Acyclic Graph): A set of tasks with an execution order.
- DAG Run: Individual DAG run.
- Web Server: It is the UI of airflow, it also allows us to manage users, roles, and different configurations for the Airflow setup.
- Scheduler: Schedules the jobs or orchestrates the tasks. It uses the DAGs object to decide what tasks need to be run, when, and where.
- Executor: Executes the tasks. There are different types of executors:
- Sequential: Runs one task instance at a time.
- Local: Runs tasks by spawning processes in a controlled fashion in different modes.
- Celery: An asynchronous task queue/job queue based on distributed message passing. For CeleryExecutor, one needs to set up a queue (Redis, RabbitMQ or any other task broker supported by Celery) on which all the celery workers running keep on polling for any new tasks to run
- Kubernetes: Provides a way to run Airflow tasks on Kubernetes, Kubernetes launch a new pod for each task.
- Metadata Database: Stores the Airflow states. Airflow uses SqlAlchemy and Object Relational Mapping (ORM) written in Python to connect to the metadata database.
