import * as React from "react";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { t } from "ttag";

type CategoryProps = {
  slug: string;
  label: string;
};

type SearchCardProps = {
  header?: React.ReactNode;
  pt?: string | any;
  pb?: string | any;
  placeholder?: string;
  searchMode?: "click" | "input";
  categories?: Array<CategoryProps>;
  onSearch?: (search: string | boolean, category?: string) => void;
};

export default function SearchCard({ pt, pb, header, categories, placeholder, searchMode, onSearch } : SearchCardProps) {
  const [category, setCategory] = React.useState<string>("");
  const [search, setSearch] = React.useState<string>("");

  React.useEffect(() => {
    if ( categories?.length && 0 < categories?.length ) {
      setCategory(categories?.[0].slug || "");
    }
  }, [categories]);

  return (
    <Container
      sx={{
        pt, pb,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Stack
        spacing={2}
        useFlexGap
        sx={{ alignItems: "center", width: { xs: "100%", sm: "70%" } }}
      >
        {header}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1}
          useFlexGap
          sx={{ pt: 2, width: "100%" }}
        >
          {categories && (
            <Select
              value={category}
              onChange={(event: SelectChangeEvent) => {
                const value = event.target.value as string;
                setCategory(value);
                onSearch?.(true, value)
              }}
            >
              {categories?.map((cat, index) => <MenuItem key={index} value={cat.slug}>{cat.label}</MenuItem>)}
            </Select>
          )}
          <TextField
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const value = event.target.value as string;
              setSearch(value);
              if ( "input" === searchMode ) {
                onSearch?.(value, category);
              }
            }}
            variant="outlined"
            aria-label={placeholder || t`Search`}
            placeholder={placeholder || t`Search`}
            fullWidth
            slotProps={{
              htmlInput: {
                autoComplete: "off",
                "aria-label": t`Search for a restriction`,
              },
            }}
          />
          {"input" !== searchMode && (
            <Button
              variant="contained"
              aria-label={t`Search`}
              color="primary"
              sx={{ minWidth: "fit-content" }}
              onClick={() => onSearch?.(search, category)}
            >
              {t`Search`}
            </Button>
          )}
        </Stack>
      </Stack>
    </Container>
  )
}
