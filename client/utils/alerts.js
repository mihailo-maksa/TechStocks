export const showSuccessMessage = (success, closeAlert) => (
  <div className="alert alert-success">
    <span>{success}</span>
    <span className="x-btn" onClick={closeAlert} title="Hide Alert">
      X
    </span>
  </div>
);

export const showErrorMessage = (error, closeAlert) => (
  <div className="alert alert-danger">
    {error}
    <span className="x-btn" onClick={closeAlert} title="Hide Alert">
      X
    </span>
  </div>
);
