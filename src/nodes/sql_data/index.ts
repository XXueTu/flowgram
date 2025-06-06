import iconStart from "../../assets/icon-start.jpg";
import { FlowNodeRegistry } from "../../typings";
import { WorkflowNodeType } from "../constants";
import { formMeta } from './form-meta';

const defaultSQL = `SELECT * FROM table_name
WHERE condition = '{}'
LIMIT 10;`;

/**
	MysqlType      DBType = "mysql"
	SqlServerType  DBType = "sqlserver"
	OracleType     DBType = "oracle"
	FileServerType DBType = "fileServer"
	ModelType      DBType = "model"
 **/
export const SQLNodeRegistry: FlowNodeRegistry = {
  type: WorkflowNodeType.Sql,
  meta: {
    size: {
      width: 360,
      height: 211,
    },
  },
  info: {
    icon: iconStart,
    description: "SQL 执行节点，支持执行 SQL 查询语句。",
  },
  formMeta,
  onAdd() {
    return {
      id: `sql_${Date.now()}`,
      type: "sql",
      data: {
        title: "SQL 执行",
        custom: {
          datasourceId: 0,
          datasourceType: "mysql",
          sql: defaultSQL,
          timeout: 30,
          retry: 3,
          errorHandlingMode: "abort",
        },
        inputs: {
          properties: {
            input1: {
              type: "string",
              title: "input1"
            }
          }
        },
        inputsValues: {
          input1: {
            type: "constant",
            content: ""
          }
        },
        outputs: {
          type: "object",
          properties: {
            outputList: { type: "array", items: { type: "object" }, default: [] },
            rowNum: { type: "integer", default: 0}
          },
          required: ["outputList", "rowNum"],
        },
      },
    };
  },
};
