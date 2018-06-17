# Deva - Development CLI

[![CircleCI](https://circleci.com/gh/mauriciomelo/deva-cli/tree/master.svg?style=svg)](https://circleci.com/gh/mauriciomelo/deva-cli/tree/master)

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

### $ref pointers

You can use JSON Schema with $ref pointers to other files and/or URLs so you can better organize and reuse your commands.

```
{
  "commands": [
    {
      // references an external file
      "$ref": "api.commands.json"
    },
    {
      // references a sub-schema in an external file
      "$ref": "shared/client#/definitions/test"
    },
    {
      // references a URL
      "$ref": "http://example.com/commands/json"
    },
    {
      // references a value in an external file via an internal reference
      "$ref": "#/definitions/thing/properties/commands"
    }
  ]
}
```
