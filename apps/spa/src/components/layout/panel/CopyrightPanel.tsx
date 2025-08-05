import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

export default function CopyrightPanel() {
  return (
    <Stack
      direction="row"
      sx={{
        p: 2,
        gap: 1,
        alignItems: "center",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box sx={{ mr: "auto" }}>
        <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: "16px" }}>
          East African Community
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          &copy; {(new Date()).getFullYear()}
        </Typography>
      </Box>
    </Stack>
  );
}
