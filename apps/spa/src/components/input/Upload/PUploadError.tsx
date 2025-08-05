import { styled } from "@mui/material/styles";

const ErrorTemplate = styled("span")(({
  padding: 0,
  textAlign: "left",
  display: "block",
  color: "rgba(0,0,0,0.65)"
}));
const ErrorTitle = styled(ErrorTemplate)({
  fontWeight: "bold",
});
const ErrorBlock = styled(ErrorTemplate)({
  paddingLeft: "10px",
});

export default function PUploadError({ invalid } : { invalid: Array<any> }) {
  return (
    <>
      {invalid.map(
        (reject: any, i: number) => (
          <p key={i}>
            <ErrorTitle>{reject.file.name}</ErrorTitle>
            {reject.errors.map(
              (error: any, j: number) => (
                <ErrorBlock key={j}>
                  {error}
                </ErrorBlock>
              )
            )}
          </p>
        )
      )}
    </>
  );
}
