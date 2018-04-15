# Deva - Development CLI

Create CLIs for your projects

### Creating a "test" command

Create a file named `commands.json` with the following content:

```
{
  "commands": [
    {
      "name": "test",
      "description": "run the tests",
      "exec": "echo Running the tests..."
    }
  ]
}
```

Executing `deva test` the output should be:

```
> echo running the tests...
running the tests...
```

### Option parsing

```
{
  "commands": [
    {
      "name": "test",
      "description": "run the tests",
      "exec": "echo Running the tests..."
      "options": [
        {
          "name": "watch",
          "transform": {
            "append": "watch mode"
          }
        }
      ]
    }
  ]
}
```

Executing `deva test --watch` the output should be:

```
> echo running the tests... watch mode
running the tests... watch mode
```
