# Merge-Request-Dokumentation: zusätzliche Frontend-Jest-Tests

## Branch

```bash
git checkout main
git pull
git checkout -b feature/frontend-edit-delete-jest-tests
```

Falls der Hauptbranch `master` heisst:

```bash
git checkout master
git pull
git checkout -b feature/frontend-edit-delete-jest-tests
```

## Patch anwenden

```bash
git apply frontend_edit_delete_jest_tests.patch
```

## Validierung

```bash
cd frontend
npm test -- --runInBand
npm run lint
npm run build
cd ..
```

Unter Windows PowerShell kann bei blockierten `.ps1`-Skripten alternativ `npm.cmd` verwendet werden:

```powershell
cd frontend
npm.cmd test -- --runInBand
npm.cmd run lint
npm.cmd run build
cd ..
```

## Commit

```bash
git add frontend/src/App.test.jsx frontend/TEST_RESULTS.md docs/FRONTEND_JEST_EXTRA_TESTS_MR.md
git commit -m "test(frontend): add edit and delete task tests"
```

## Push

```bash
git push -u origin feature/frontend-edit-delete-jest-tests
```

## Merge-Request-Titel

```text
Add edit and delete Jest tests for React frontend
```

## Merge-Request-Beschreibung

```text
Adds two additional Jest tests for the React frontend.

Changes:
- Adds a test for editing an existing task via PUT /tasks/{id}
- Adds a test for deleting an existing task via DELETE /tasks/{id}
- Updates frontend/TEST_RESULTS.md to document all 11 passing frontend tests
- Documents branch, commit, validation and merge-request steps

Validation:
- npm test -- --runInBand
- npm run lint
- npm run build
```
