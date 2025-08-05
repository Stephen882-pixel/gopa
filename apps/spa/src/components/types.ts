import * as React from "react";

export interface ThemeProps {
  default?: string;
  topbar?: string;
  sidebar?: string;
}

export interface ErrorBoxProps {
  children: React.ReactNode;
  mode?: "default" | "simple" | "fill";
}

export interface AuthProps {
  permissions?: string[];
  condition?: "AND" | "OR";
}

export interface StyledSearchBoxProps {
  isLight?: boolean;
}

export interface SearchBoxProps extends StyledSearchBoxProps {
  onChange?: (val: string) => void;
}

export interface APIProps {
  url?: string;
  method?: string;
  params?: PObjectProps;
}

export interface PObjectProps {
  [key: string]: any;
}

export interface PCardPanelProps {
  children?: React.ReactNode;
  title?: string | React.ReactNode;
  tools?: React.ReactNode;
  padding?: number;
  isLight?: boolean;
}

interface PCarouselSizeProps {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
}

export interface PCarouselProps {
  display?: PCarouselSizeProps;
  pad?: number;
  children: React.ReactNode;
}

export interface FormComponentProps {
  data?: PObjectProps | null;
  errors?: PObjectProps | null;
  objects?: PObjectProps | null;
  setContent?: (name: string, content: any) => void;
}

export interface PFormProps {
  children: React.ReactNode;
  flexDirection?: "column-reverse" | "column";
  onValidate?: () => boolean;
  onSubmit?: (form: HTMLFormElement) => void;
}

export type PFormContentType = "json" | "multipart";

type PTableColumnItem = undefined | number | string | boolean | React.ReactNode;

export interface PTableColumnProps {
  label: PTableColumnItem;
  selector: (row: any) => PTableColumnItem;
  id?: string;
  numeric?: boolean;
  sortable?: boolean;
  sortField?: string;
  omit?: boolean;
  wrap?: boolean;
}

export interface PTableOrderByProps {
  column: string | number;
  direction?: "asc" | "desc";
}

interface TableFilterHookProps {
  apiUrl: string;
  defaultFilter?: any;
  orderBy?: PTableOrderByProps;
  defaultLimit?: number;
}

export interface PTableFilterHookProps extends TableFilterHookProps {
  columns?: PTableColumnProps[];
}

export interface PTableFilterProps {
  page?: number;
  limit?: number;
  filter?: any;
  search?: string | number;
}

export type PTableDeleteModes = "archive" | "delete";

export interface PTableProps extends TableFilterHookProps {
  columns: PTableColumnProps[];
  padding?: number;
  rowsPerPageOptions?: Array<number>;
  hideActions?: boolean;
  hasPreview?: boolean;
  hasEdit?: boolean;
  hasDelete?: boolean;
  deleteMode?: PTableDeleteModes;
  onPreview?: (row: any) => void;
  onEdit?: (row: any) => void;
  renderExtraAction?: ({ row }: { row: any }) => React.ReactNode;
}

export interface PTableEvents {
  getFilterArgs: () => PObjectProps;
  onRefresh: () => Promise<PObjectProps>;
  onFilter: (opts: PObjectProps) => undefined | Promise<PObjectProps>;
}

export interface PTableToolBarExtraProps {
  filter?: PObjectProps;
  onFilter?: (opts: PObjectProps) => void;
}

export interface PTableToolBarProps {
  isLight?: boolean;
  searchLength?: number;
  onFilter?: (opts: PObjectProps) => void;
  extraToolbar?: (opts: PTableToolBarExtraProps) => React.ReactNode;
}

export interface PViewEvents {
  onRefresh: () => void;
}

export type PViewProps =
  Pick<PTableProps, "apiUrl" | "defaultFilter" | "orderBy" | "defaultLimit" | "columns" | "padding" | "rowsPerPageOptions" | "renderExtraAction">
  & {
    title?: string | React.ReactNode,
    extraToolbar?: (opts: PTableToolBarExtraProps) => React.ReactNode,
  };

export type PViewDialogProps =
  Pick<PTableProps, "apiUrl" | "columns" | "renderExtraAction">
  & Pick<PTableToolBarProps, "isLight">
  & {
    index: string | undefined,
    title?: string | React.ReactNode,
    objects?: PObjectProps | null;
    FormComponent?: (props: FormComponentProps) => React.ReactNode;
  };

export interface PGridProps extends PTableProps {
  FormComponent?: (props: FormComponentProps) => React.ReactNode;
  contentType?: PFormContentType;
  objects?: PObjectProps;
  title?: string | React.ReactNode;
  isLight?: boolean;
  hasAdd?: boolean;
  onAdd?: () => void;
  extraToolbar?: (opts: PTableToolBarExtraProps) => React.ReactNode;
}

export interface PGridEvents {
  onRefresh: () => void;
}

export interface PTreeItem {
  id: string;
  label: string;
  parent?: number | string;
  children?: Array<PTreeItem>
}

export interface PFlatTreeItem {
  id: string | number;
  parent: string | number;
  label: string;
}

export interface PTreeProps {
  tree: Array<PTreeItem>;
  id?: string;
  defaultSelectedItems?: string[];
  multiSelect?: boolean;
  checkboxSelection?: boolean;
  onSelect?: (nodes: PTreeItem[]) => void;
}

export interface PNotchProps {
  children: React.ReactNode;
  label?: string;
  error?: boolean;
}

export interface PWellProps {
  children: React.ReactNode;
  color?: "error" | "warning" | "success" | "info" ;
}

interface BasicInputProps {
  name?: string;
  label?: string;
  error?: boolean;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  helperText?: string;
}

interface InputProps extends BasicInputProps {
  fullWidth?: boolean;
  defaultValue?: any;
  onChange?: (val: string) => void;
}

export interface PSelectProps extends InputProps {
  children: React.ReactNode;
  multiple?: boolean;
}

export interface PImageInputProps extends BasicInputProps {
  fluid?: boolean;
  defaultValue?: any;
  mbMax?: number;
}

export interface PUploadAcceptProps {
  [key: string]: string[];
}

export type PUploadProps = BasicInputProps & {
  defaultValue?: any;
  onChange?: (files: any[]) => void;
  accept?: PUploadAcceptProps;
  mbMax?: number;
  multiple?: boolean;
};

export interface PCheckboxProps extends BasicInputProps {
  selected?: boolean;
  onSelect?: (selected: boolean) => void;
}

interface PAutocompleteOption {
  id: string;
  label: string;
}

export interface PAutocompleteProps extends InputProps {
  api: string | APIProps;
  serialise?: (row: any) => PAutocompleteOption;
  multiple?: boolean;
}

export interface PI18nProps extends BasicInputProps {
  fullWidth?: boolean;
  data?: null | PObjectProps;
  defaultValue?: string;
  defaultLocale?: string;
  multiline?: boolean;
  rows?: number | string;
  onChange?: (val: string, lang: string) => void;
}

export type SectorSelectorProps =
  Omit<InputProps, "onChange">
  & Omit<PTreeProps, "tree">
  & {
    parentId?: string;
    mode?: "input" | "simple" | "display";
  };

export interface SectorSelectorEvents {
  onRefresh: () => Promise<void | PObjectProps>;
}

export interface PReportProps {
  index: number;
  minutes?: number;
  height?: number;
}

export interface PSkeletonProps {
  animation?: "pulse" | "wave";
}
