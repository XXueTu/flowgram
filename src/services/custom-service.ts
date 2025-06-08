import { FreeLayoutPluginContext, inject, injectable, Playground, SelectionService, WorkflowDocument } from '@flowgram.ai/free-layout-editor';
import axios from 'axios';

const API_BASE_URL = "http://10.8.0.61:8888/workflow";

interface ApiResponse<T> {
  code: number;
  msg: string;
  data: T;
}

/**
 * Docs: https://inversify.io/docs/introduction/getting-started/
 * Warning: Use decorator legacy
 *   // rsbuild.config.ts
 *   {
 *     source: {
 *       decorators: {
 *         version: 'legacy'
 *       }
 *     }
 *   }
 * Usage:
 *  1.
 *    const myService = useService(CustomService)
 *    myService.save()
 *  2.
 *    const myService = useClientContext().get(CustomService)
 *  3.
 *    const myService = node.getService(CustomService)
 */
@injectable()
export class CustomService {
  @inject(FreeLayoutPluginContext) ctx: FreeLayoutPluginContext;

  @inject(SelectionService) selectionService: SelectionService;

  @inject(Playground) playground: Playground;

  @inject(WorkflowDocument) document: WorkflowDocument;

  save() {
    console.log(this.document.toJSON());
  }
}

export interface Case {
  workspaceId: string;
  caseId: string;
  caseName: string;
  caseParams: string;
  createAt: string;
  updateAt: string;
  createBy: string;
  updateBy: string;
}

export interface CaseCreateRequest {
  workspaceId: string;
  caseName: string;
  caseParams: string;
}

export interface CaseCreateResponse {
  caseId: string;
}

export interface CaseListRequest {
  workspaceId: string;
}

export interface CaseListResponse {
  caseList: Case[];
}

export interface CaseDetailRequest {
  caseId: string;
}

export interface CaseDetailResponse {
  case: Case;
}

export interface CaseDeleteRequest {
  caseId: string;
}

export interface CaseDeleteResponse {
  success: boolean;
}

export interface CaseEditRequest {
  caseId: string;
  caseName: string;
  caseParams: string;
}

export interface CaseEditResponse {
  success: boolean;
}

export const caseService = {
  create: async (data: CaseCreateRequest) => {
    const response = await axios.post<ApiResponse<CaseCreateResponse>>(`${API_BASE_URL}/case/publish`, data);
    return response.data.data;
  },
  list: async (data: CaseListRequest) => {
    const response = await axios.post<ApiResponse<CaseListResponse>>(`${API_BASE_URL}/case/list`, data);
    return response.data.data;
  },
  detail: async (data: CaseDetailRequest) => {
    const response = await axios.post<ApiResponse<CaseDetailResponse>>(`${API_BASE_URL}/case/detail`, data);
    return response.data.data;
  },
  delete: async (data: CaseDeleteRequest) => {
    const response = await axios.post<ApiResponse<CaseDeleteResponse>>(`${API_BASE_URL}/case/delete`, data);
    return response.data.data;
  },
  edit: async (data: CaseEditRequest) => {
    const response = await axios.post<ApiResponse<CaseEditResponse>>(`${API_BASE_URL}/case/edit`, data);
    return response.data.data;
  },
};
