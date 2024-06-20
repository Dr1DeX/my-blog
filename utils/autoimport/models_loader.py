import os
import importlib
import inspect
from pathlib import Path


def import_all_models():
    base_dir = Path(__file__).resolve().parent / 'app'
    unique_class = {}

    for root, dirs, files in os.walk(base_dir):
        for file in files:
            if file == 'models.py':
                module_path = os.path.relpath(os.path.join(root, file), start=base_dir.parent)
                module_name = module_path.replace(os.sep, '.').replace('.py', '')
                module = importlib.import_module(module_name)
                for name, obj in inspect.getmembers(module, inspect.isclass):
                    if obj.__module__.startswith('app'):
                        if name not in unique_class:
                            print(name, obj)
                            unique_class[name] = obj

    globals().update(unique_class)


if __name__ == '__main__':
    import_all_models()
